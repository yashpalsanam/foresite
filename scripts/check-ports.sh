#!/bin/bash

# Check if required ports are available

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Checking port availability..."
echo ""

PORTS=(3000 3001 5000)
PORT_NAMES=("Admin Panel" "Back-end API" "Front-end")
PORTS_IN_USE=()

for i in "${!PORTS[@]}"; do
    PORT=${PORTS[$i]}
    NAME=${PORT_NAMES[$i]}

    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}✗ Port $PORT ($NAME) is in use${NC}"
        PORTS_IN_USE+=($PORT)

        # Show what's using the port
        PID=$(lsof -ti:$PORT)
        PROCESS=$(ps -p $PID -o comm= 2>/dev/null || echo "unknown")
        echo "  Process: $PROCESS (PID: $PID)"
        echo ""
    else
        echo -e "${GREEN}✓ Port $PORT ($NAME) is available${NC}"
    fi
done

echo ""

if [ ${#PORTS_IN_USE[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All ports are available!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  ${#PORTS_IN_USE[@]} port(s) in use${NC}"
    echo ""
    echo "To free up ports, you can:"
    echo "1. Stop the processes using these ports"
    echo "2. Kill processes: kill -9 <PID>"
    echo "3. Or change the ports in your environment files"
    exit 1
fi
