import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    [key: string]: {
      status: 'operational' | 'degraded' | 'down';
      responseTime?: number;
      lastCheck: string;
    };
  };
  metadata: {
    buildTime: string;
    commitSha?: string;
    region?: string;
    memory?: {
      used: number;
      total: number;
    };
  };
}

// Cache health check results for a short period
let cachedHealthStatus: HealthStatus | null = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_CACHE_MS = 30000; // 30 seconds

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Return cached result if recent
    if (cachedHealthStatus && (now - lastHealthCheck) < HEALTH_CHECK_CACHE_MS) {
      return NextResponse.json(cachedHealthStatus, { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=30',
          'Content-Type': 'application/json',
        }
      });
    }

    // Perform health checks
    const startTime = Date.now();
    const healthStatus = await performHealthChecks();
    const responseTime = Date.now() - startTime;

    // Cache the result
    cachedHealthStatus = healthStatus;
    lastHealthCheck = now;

    // Determine HTTP status based on health
    const httpStatus = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'public, max-age=30',
        'Content-Type': 'application/json',
        'X-Response-Time': `${responseTime}ms`,
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
      uptime: process.uptime(),
      services: {
        application: {
          status: 'down',
          lastCheck: new Date().toISOString(),
        }
      },
      metadata: {
        buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
        commitSha: process.env.VERCEL_GIT_COMMIT_SHA,
        region: process.env.VERCEL_REGION,
      }
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

async function performHealthChecks(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  const services: HealthStatus['services'] = {};

  // Check application core functionality
  services.application = await checkApplicationHealth();
  
  // Check database (if applicable)
  // services.database = await checkDatabaseHealth();
  
  // Check external APIs (if applicable)
  // services.externalAPIs = await checkExternalAPIs();

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  
  // Determine overall status
  const serviceStatuses = Object.values(services).map(s => s.status);
  const overallStatus = serviceStatuses.every(s => s === 'operational') ? 'healthy' :
                       serviceStatuses.some(s => s === 'operational') ? 'degraded' : 'unhealthy';

  return {
    status: overallStatus,
    timestamp,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    services,
    metadata: {
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA,
      region: process.env.VERCEL_REGION,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      }
    }
  };
}

async function checkApplicationHealth() {
  const startTime = Date.now();
  
  try {
    // Simulate checking core application functionality
    // This could include checking if key modules load, database connections, etc.
    
    // Check if essential environment variables are set
    const requiredEnvVars = ['NODE_ENV'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      return {
        status: 'degraded' as const,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
      };
    }

    return {
      status: 'operational' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'down' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  }
}

// Example database health check (implement when needed)
async function checkDatabaseHealth() {
  const startTime = Date.now();
  
  try {
    // Implement database connection check
    // Example: await db.query('SELECT 1');
    
    return {
      status: 'operational' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'down' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  }
}

// Example external API health check
async function checkExternalAPIs() {
  const startTime = Date.now();
  
  try {
    // Check external dependencies
    // Example: OpenAI API, external data sources, etc.
    
    return {
      status: 'operational' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'down' as const,
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    };
  }
}

// Handle HEAD requests for simple availability checks
export async function HEAD(request: NextRequest) {
  try {
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30',
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
} 