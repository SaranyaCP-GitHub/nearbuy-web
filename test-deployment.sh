#!/bin/bash

# Test script to debug deployment issues
echo "=== Testing Current Deployment ==="

# Check if container is running
echo "1. Checking container status:"
docker ps | grep nearbuy-dev

# Check container logs
echo -e "\n2. Container logs (last 20 lines):"
docker logs nearbuy-dev --tail 20

# Check if port 80 is listening
echo -e "\n3. Checking if port 80 is listening:"
netstat -tlnp | grep :80 || ss -tlnp | grep :80

# Test local connection
echo -e "\n4. Testing local connection to port 80:"
curl -I http://localhost:80 || echo "Local connection failed"

# Test from container perspective
echo -e "\n5. Testing from inside container:"
docker exec nearbuy-dev curl -I http://localhost:80 || echo "Container internal test failed"

# Check nginx status inside container
echo -e "\n6. Checking nginx status inside container:"
docker exec nearbuy-dev ps aux | grep nginx || echo "Nginx not found in container"

# Check if nginx config is valid
echo -e "\n7. Checking nginx configuration:"
docker exec nearbuy-dev nginx -t 2>&1 || echo "Nginx config test failed"

echo -e "\n=== Test Complete ===" 