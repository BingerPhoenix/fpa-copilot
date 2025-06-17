#!/bin/bash

# FP&A Copilot Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environment: preview|production (default: preview)

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-preview}
PROJECT_NAME="fpa-copilot"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18.17.0 or higher."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.17.0"
    if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
        if ! npm list semver &> /dev/null; then
            # Simple version check without semver
            MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
            if [ "$MAJOR_VERSION" -lt 18 ]; then
                log_error "Node.js version $NODE_VERSION is too old. Please use version 18.17.0 or higher."
                exit 1
            fi
        fi
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm 9.0.0 or higher."
        exit 1
    fi
    
    # Check if Vercel CLI is installed (for deployment)
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    log_success "Prerequisites check passed"
}

# Function to clean up
cleanup() {
    log_info "Cleaning up previous builds..."
    rm -rf .next
    rm -rf out
    rm -rf dist
    log_success "Cleanup completed"
}

# Function to install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm ci --production=false
    log_success "Dependencies installed"
}

# Function to run linting
run_linting() {
    log_info "Running code quality checks..."
    
    # Type checking
    log_info "Checking TypeScript types..."
    npm run type-check
    
    # Linting (optional - show warnings but don't fail)
    log_info "Running ESLint..."
    npm run lint || log_warning "ESLint found issues (non-blocking)"
    
    log_success "Code quality checks completed"
}

# Function to run tests
run_tests() {
    log_info "Running tests..."
    npm test
    log_success "Tests passed"
}

# Function to build application
build_application() {
    log_info "Building application for $ENVIRONMENT..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        NODE_ENV=production npm run build:production
    else
        npm run build
    fi
    
    log_success "Build completed successfully"
}

# Function to run security audit
security_audit() {
    log_info "Running security audit..."
    npm audit --audit-level=high || log_warning "Security vulnerabilities found (review recommended)"
    log_success "Security audit completed"
}

# Function to validate build
validate_build() {
    log_info "Validating build output..."
    
    # Check if .next directory exists
    if [ ! -d ".next" ]; then
        log_error "Build output not found (.next directory missing)"
        exit 1
    fi
    
    # Check if static files were generated
    if [ ! -d ".next/static" ]; then
        log_error "Static files not generated"
        exit 1
    fi
    
    # Check if standalone output exists (for Vercel)
    if [ ! -f ".next/standalone/server.js" ]; then
        log_warning "Standalone server not found (may be expected for some deployments)"
    fi
    
    log_success "Build validation passed"
}

# Function to deploy to Vercel
deploy_to_vercel() {
    log_info "Deploying to Vercel ($ENVIRONMENT)..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod --yes
    else
        vercel --yes
    fi
    
    DEPLOYMENT_URL=$(vercel --json | jq -r '.url' 2>/dev/null || echo "Check Vercel dashboard for URL")
    
    log_success "Deployment completed"
    log_info "Deployment URL: https://$DEPLOYMENT_URL"
}

# Function to run health check
health_check() {
    log_info "Running post-deployment health check..."
    
    if [ -n "$DEPLOYMENT_URL" ] && [ "$DEPLOYMENT_URL" != "Check Vercel dashboard for URL" ]; then
        sleep 10  # Wait for deployment to be ready
        
        HEALTH_URL="https://$DEPLOYMENT_URL/api/health-check"
        log_info "Checking health endpoint: $HEALTH_URL"
        
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            log_success "Health check passed (HTTP $HTTP_STATUS)"
        else
            log_warning "Health check failed (HTTP $HTTP_STATUS)"
        fi
    else
        log_warning "Skipping health check (deployment URL not available)"
    fi
}

# Function to generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
FP&A Copilot Deployment Report
==============================

Date: $(date)
Environment: $ENVIRONMENT
Node.js Version: $(node --version)
npm Version: $(npm --version)

Build Information:
- Build Status: SUCCESS
- Output Directory: .next
- Build Size: $(du -sh .next 2>/dev/null | cut -f1 || echo "N/A")

Deployment Information:
- Platform: Vercel
- URL: https://$DEPLOYMENT_URL
- Status: $([ -n "$DEPLOYMENT_URL" ] && echo "DEPLOYED" || echo "PENDING")

Next Steps:
1. Verify application functionality at deployment URL
2. Test all major features and user flows
3. Monitor application performance and logs
4. Update DNS records if using custom domain

For support: support@fpa-copilot.com
EOF

    log_success "Deployment report generated: $REPORT_FILE"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [environment]"
    echo ""
    echo "Arguments:"
    echo "  environment    Target environment (preview|production) [default: preview]"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy to preview environment"
    echo "  $0 preview      # Deploy to preview environment"
    echo "  $0 production   # Deploy to production environment"
    echo ""
    echo "Environment Variables:"
    echo "  SKIP_TESTS=true           # Skip running tests"
    echo "  SKIP_LINT=true            # Skip linting checks"
    echo "  SKIP_AUDIT=true           # Skip security audit"
    echo "  SKIP_HEALTH_CHECK=true    # Skip post-deployment health check"
}

# Main deployment process
main() {
    echo ""
    echo "🚀 FP&A Copilot Deployment Script"
    echo "=================================="
    echo ""
    
    # Validate arguments
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_usage
        exit 0
    fi
    
    if [ "$ENVIRONMENT" != "preview" ] && [ "$ENVIRONMENT" != "production" ]; then
        log_error "Invalid environment: $ENVIRONMENT. Use 'preview' or 'production'"
        show_usage
        exit 1
    fi
    
    log_info "Starting deployment to $ENVIRONMENT environment..."
    
    # Change to project root
    cd "$ROOT_DIR"
    
    # Run deployment steps
    check_prerequisites
    cleanup
    install_dependencies
    
    # Optional steps (can be skipped with environment variables)
    if [ "$SKIP_AUDIT" != "true" ]; then
        security_audit
    fi
    
    if [ "$SKIP_LINT" != "true" ]; then
        run_linting
    fi
    
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    fi
    
    build_application
    validate_build
    deploy_to_vercel
    
    if [ "$SKIP_HEALTH_CHECK" != "true" ]; then
        health_check
    fi
    
    generate_report
    
    echo ""
    log_success "🎉 Deployment completed successfully!"
    echo ""
    log_info "Next steps:"
    echo "  1. Test the application at: https://$DEPLOYMENT_URL"
    echo "  2. Verify all features work as expected"
    echo "  3. Monitor logs for any issues"
    echo "  4. Update team on deployment status"
    echo ""
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@" 