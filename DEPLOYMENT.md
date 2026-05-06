# Lawvanta Deployment Guide

## Deployment Options

### 1. Docker Compose (Recommended for Development/Small Scale)

**Pros:**
- Easy setup
- All services in one place
- Good for development and testing
- Suitable for small deployments (< 100 users)

**Setup:**

```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Kubernetes (Recommended for Production)

**Pros:**
- Highly scalable
- Auto-healing
- Load balancing
- Rolling updates
- Suitable for large deployments (1000+ users)

**Prerequisites:**
- Kubernetes cluster (AWS EKS, Azure AKS, GCP GKE, or self-hosted)
- kubectl configured
- Helm (optional)

**Setup:**

```bash
# Create namespace
kubectl create namespace lawvanta

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n lawvanta
kubectl get services -n lawvanta
```

### 3. Cloud Platform Services

#### AWS Deployment

**Services:**
- **Compute**: ECS Fargate or EKS
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3
- **CDN**: CloudFront
- **Load Balancer**: ALB
- **DNS**: Route 53

**Estimated Cost (Monthly):**
- Small (100 users): $200-300
- Medium (1000 users): $800-1200
- Large (10000 users): $3000-5000

#### Azure Deployment

**Services:**
- **Compute**: Azure Container Instances or AKS
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Storage**: Azure Blob Storage
- **CDN**: Azure CDN
- **Load Balancer**: Azure Load Balancer
- **DNS**: Azure DNS

#### Google Cloud Deployment

**Services:**
- **Compute**: Cloud Run or GKE
- **Database**: Cloud SQL PostgreSQL
- **Cache**: Memorystore Redis
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Load Balancer**: Cloud Load Balancing
- **DNS**: Cloud DNS

## Environment Configuration

### Production Environment Variables

**Backend:**

```env
NODE_ENV=production
PORT=5000

# Database (use managed service)
DATABASE_URL=postgresql://user:pass@prod-db.region.rds.amazonaws.com:5432/lawvanta
DATABASE_SSL=true
DATABASE_POOL_SIZE=20

# Redis (use managed service)
REDIS_URL=redis://prod-redis.region.cache.amazonaws.com:6379
REDIS_TLS=true

# JWT (use strong secret)
JWT_SECRET=<generate-strong-32+-char-secret>
JWT_EXPIRES_IN=7d

# AI
OPENAI_API_KEY=<production-key>
OPENAI_MODEL=gpt-4-turbo-preview
PINECONE_API_KEY=<production-key>
PINECONE_ENVIRONMENT=production
PINECONE_INDEX=lawvanta-prod

# Storage
AWS_ACCESS_KEY_ID=<production-key>
AWS_SECRET_ACCESS_KEY=<production-secret>
AWS_REGION=ap-south-1
AWS_S3_BUCKET=lawvanta-prod-documents

# Security
ENCRYPTION_KEY=<generate-strong-32-char-key>
CORS_ORIGIN=https://lawvanta.com

# Monitoring
SENTRY_DSN=<sentry-dsn>
LOG_LEVEL=info
```

**Frontend:**

```env
NEXT_PUBLIC_API_URL=https://api.lawvanta.com
NEXT_PUBLIC_WS_URL=wss://api.lawvanta.com
NEXT_PUBLIC_APP_NAME=Lawvanta
NEXT_PUBLIC_ENVIRONMENT=production
```

## SSL/TLS Configuration

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d lawvanta.com -d www.lawvanta.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Using AWS Certificate Manager

1. Request certificate in ACM
2. Validate domain ownership
3. Attach to ALB/CloudFront

## Database Migration

### Backup Current Database

```bash
# PostgreSQL backup
pg_dump -U postgres lawvanta > backup.sql

# Restore
psql -U postgres lawvanta < backup.sql
```

### Migration Strategy

1. **Blue-Green Deployment**
   - Deploy new version alongside old
   - Switch traffic after verification
   - Rollback if issues

2. **Rolling Update**
   - Update instances one by one
   - Zero downtime
   - Gradual rollout

3. **Canary Deployment**
   - Route small % of traffic to new version
   - Monitor metrics
   - Gradually increase traffic

## Monitoring Setup

### Prometheus + Grafana

```bash
# Install Prometheus
helm install prometheus prometheus-community/prometheus

# Install Grafana
helm install grafana grafana/grafana

# Access Grafana
kubectl port-forward svc/grafana 3000:80
```

### Application Monitoring

**Metrics to Monitor:**
- Request rate
- Response time (p50, p95, p99)
- Error rate
- CPU usage
- Memory usage
- Database connections
- Redis connections
- AI API latency
- WebSocket connections

**Alerts:**
- High error rate (> 1%)
- Slow response time (> 1s)
- High CPU (> 80%)
- High memory (> 85%)
- Database connection pool exhausted
- Redis connection failures

### Logging

**ELK Stack:**

```bash
# Install Elasticsearch
helm install elasticsearch elastic/elasticsearch

# Install Logstash
helm install logstash elastic/logstash

# Install Kibana
helm install kibana elastic/kibana
```

**Log Levels:**
- ERROR: Critical errors
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Debug information (dev only)

## Backup Strategy

### Database Backups

**Automated Daily Backups:**

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="lawvanta"

# Create backup
pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://lawvanta-backups/
```

**Cron Job:**

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### Document Backups

- S3 versioning enabled
- Cross-region replication
- Lifecycle policies

## Scaling Strategy

### Horizontal Scaling

**Backend:**
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Database:**
- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)
- Query optimization

**Redis:**
- Redis Cluster for high availability
- Separate cache and session stores

### Vertical Scaling

**When to Scale Up:**
- CPU consistently > 70%
- Memory consistently > 80%
- Disk I/O bottleneck

**Instance Sizes:**
- Small: 2 vCPU, 4GB RAM
- Medium: 4 vCPU, 8GB RAM
- Large: 8 vCPU, 16GB RAM

## Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Strong JWT secret (32+ characters)
- [ ] Database encryption at rest
- [ ] Database encryption in transit
- [ ] Firewall rules configured
- [ ] Security groups configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Secrets in environment variables (not code)
- [ ] Regular security updates
- [ ] Vulnerability scanning
- [ ] Penetration testing
- [ ] Audit logging enabled
- [ ] Backup encryption
- [ ] DDoS protection
- [ ] WAF configured

## Performance Optimization

### Frontend

- Enable Next.js production build
- Use CDN for static assets
- Enable image optimization
- Implement code splitting
- Use service workers
- Enable compression (gzip/brotli)
- Minimize bundle size

### Backend

- Enable response compression
- Implement caching (Redis)
- Use connection pooling
- Optimize database queries
- Use indexes
- Enable query caching
- Implement rate limiting
- Use Bull for async jobs

### Database

- Create appropriate indexes
- Regular VACUUM and ANALYZE
- Optimize slow queries
- Use prepared statements
- Enable query plan caching
- Monitor slow query log

## Disaster Recovery

### RTO (Recovery Time Objective)

Target: < 1 hour

### RPO (Recovery Point Objective)

Target: < 15 minutes

### Recovery Procedures

1. **Database Failure**
   - Promote read replica to primary
   - Update connection strings
   - Verify data integrity

2. **Application Failure**
   - Rollback to previous version
   - Restore from backup if needed
   - Investigate root cause

3. **Complete Outage**
   - Activate DR site
   - Restore from backups
   - Update DNS records
   - Verify all services

## Cost Optimization

### AWS Cost Optimization

- Use Reserved Instances (40-60% savings)
- Use Spot Instances for non-critical workloads
- Right-size instances
- Use S3 lifecycle policies
- Enable CloudFront caching
- Use Auto Scaling
- Monitor unused resources

### Database Cost Optimization

- Use appropriate instance size
- Enable storage auto-scaling
- Use read replicas efficiently
- Archive old data
- Optimize queries

## Compliance

### Data Residency

- Store data in Indian data centers
- Use AWS ap-south-1 (Mumbai)
- Or Azure Central India
- Or GCP asia-south1 (Mumbai)

### DPDP Act Compliance

- Implement data retention policies
- Enable audit logging
- Provide data export functionality
- Implement data deletion
- Obtain user consent
- Privacy policy
- Terms of service

## Support & Maintenance

### Regular Maintenance

- Weekly: Review logs and metrics
- Monthly: Security updates
- Quarterly: Performance review
- Annually: Disaster recovery drill

### On-Call Rotation

- 24/7 on-call support
- Escalation procedures
- Incident response plan
- Post-mortem process

## Rollback Procedures

### Quick Rollback

```bash
# Kubernetes rollback
kubectl rollout undo deployment/backend -n lawvanta

# Docker rollback
docker-compose down
docker-compose up -d --build <previous-version>
```

### Database Rollback

```bash
# Restore from backup
psql -U postgres lawvanta < backup_20260504.sql
```

## Contact

For deployment support:
- 📧 Email: devops@lawvanta.com
- 📞 Phone: +91-XXXX-XXXXXX (24/7)
- 💬 Slack: #lawvanta-ops
