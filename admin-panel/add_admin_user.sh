#!/bin/bash

################################################################################
# Foresite Admin User Creation Script
# Purpose: Add admin users to the Foresite backend via REST API
# Usage: ./add_admin_user.sh
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:5000/api/v1}"
CONTENT_TYPE="Content-Type: application/json"

################################################################################
# Helper Functions
################################################################################

print_banner() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "  Foresite Admin User Creation Tool"
    echo "=========================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

validate_email() {
    local email=$1
    if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 1
    fi
    return 0
}

validate_password() {
    local password=$1
    if [[ ${#password} -lt 8 ]]; then
        print_error "Password must be at least 8 characters long"
        return 1
    fi
    return 0
}

check_api_health() {
    print_info "Checking API health..."
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL/health" 2>/dev/null || echo "000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        print_success "API is reachable and healthy"
        return 0
    else
        print_error "API health check failed (HTTP $http_code)"
        print_info "Response: $body"
        return 1
    fi
}

################################################################################
# Main Functions
################################################################################

create_admin_user() {
    local email=$1
    local password=$2
    local firstName=$3
    local lastName=$4
    local phone=$5
    
    print_info "Creating admin user: $email"
    
    # Prepare JSON payload
    local payload=$(cat <<EOF
{
    "email": "$email",
    "password": "$password",
    "firstName": "$firstName",
    "lastName": "$lastName",
    "phone": "$phone",
    "role": "admin"
}
EOF
)
    
    # Make API request
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_BASE_URL/auth/register" \
        -H "$CONTENT_TYPE" \
        -d "$payload" 2>/dev/null || echo "{}\n000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        print_success "Admin user created successfully!"
        echo -e "\n${GREEN}User Details:${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
        return 0
    else
        print_error "Failed to create admin user (HTTP $http_code)"
        echo -e "\n${RED}Error Response:${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
        return 1
    fi
}

create_admin_direct() {
    local email=$1
    local password=$2
    local firstName=$3
    local lastName=$4
    local phone=$5
    local adminToken=$6
    
    print_info "Creating admin user via admin endpoint: $email"
    
    # Prepare JSON payload
    local payload=$(cat <<EOF
{
    "email": "$email",
    "password": "$password",
    "firstName": "$firstName",
    "lastName": "$lastName",
    "phone": "$phone",
    "role": "admin"
}
EOF
)
    
    # Make API request with admin authentication
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_BASE_URL/admin/users" \
        -H "$CONTENT_TYPE" \
        -H "Authorization: Bearer $adminToken" \
        -d "$payload" 2>/dev/null || echo "{}\n000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        print_success "Admin user created successfully!"
        echo -e "\n${GREEN}User Details:${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
        return 0
    else
        print_error "Failed to create admin user (HTTP $http_code)"
        echo -e "\n${RED}Error Response:${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
        return 1
    fi
}

login_user() {
    local email=$1
    local password=$2
    
    print_info "Logging in as: $email"
    
    local payload=$(cat <<EOF
{
    "email": "$email",
    "password": "$password"
}
EOF
)
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$API_BASE_URL/auth/login" \
        -H "$CONTENT_TYPE" \
        -d "$payload" 2>/dev/null || echo "{}\n000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        token=$(echo "$body" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
        if [ -n "$token" ]; then
            print_success "Login successful!"
            echo "$token"
            return 0
        fi
    fi
    
    print_error "Login failed (HTTP $http_code)"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    return 1
}

interactive_mode() {
    print_banner
    
    echo -e "${BLUE}Interactive Admin User Creation${NC}\n"
    
    # Get user input
    read -p "Email: " email
    while ! validate_email "$email"; do
        print_error "Invalid email format"
        read -p "Email: " email
    done
    
    read -sp "Password: " password
    echo
    while ! validate_password "$password"; do
        read -sp "Password (min 8 chars): " password
        echo
    done
    
    read -sp "Confirm Password: " password_confirm
    echo
    while [ "$password" != "$password_confirm" ]; do
        print_error "Passwords do not match"
        read -sp "Password: " password
        echo
        read -sp "Confirm Password: " password_confirm
        echo
    done
    
    read -p "First Name: " firstName
    read -p "Last Name: " lastName
    read -p "Phone (optional): " phone
    
    echo -e "\n${YELLOW}Creating admin user with:${NC}"
    echo "  Email: $email"
    echo "  Name: $firstName $lastName"
    echo "  Phone: ${phone:-N/A}"
    echo "  Role: admin"
    echo
    
    read -p "Proceed? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Cancelled by user"
        exit 0
    fi
    
    # Check API health
    if ! check_api_health; then
        print_error "Cannot proceed - API is not available"
        exit 1
    fi
    
    # Create user
    if create_admin_user "$email" "$password" "$firstName" "$lastName" "$phone"; then
        echo
        print_success "Admin user setup complete!"
        echo -e "\n${YELLOW}Next steps:${NC}"
        echo "  1. Login at: $API_BASE_URL/auth/login"
        echo "  2. Use credentials: $email"
        echo "  3. Access admin panel"
    else
        exit 1
    fi
}

batch_mode() {
    local email=$1
    local password=$2
    local firstName=$3
    local lastName=$4
    local phone=$5
    
    print_banner
    
    if ! validate_email "$email"; then
        print_error "Invalid email format: $email"
        exit 1
    fi
    
    if ! validate_password "$password"; then
        print_error "Password validation failed"
        exit 1
    fi
    
    if ! check_api_health; then
        print_error "API health check failed"
        exit 1
    fi
    
    if create_admin_user "$email" "$password" "$firstName" "$lastName" "$phone"; then
        print_success "Admin user created successfully in batch mode"
        exit 0
    else
        exit 1
    fi
}

show_help() {
    cat <<EOF
Usage: $0 [OPTIONS]

Options:
    -i, --interactive          Interactive mode (default)
    -e, --email EMAIL          Admin email
    -p, --password PASSWORD    Admin password
    -f, --first-name NAME      First name
    -l, --last-name NAME       Last name
    -n, --phone PHONE          Phone number (optional)
    -u, --url URL              API base URL (default: http://localhost:5000/api/v1)
    -t, --token TOKEN          Existing admin token for authenticated creation
    -h, --help                 Show this help message

Examples:
    # Interactive mode
    $0 -i

    # Batch mode
    $0 -e admin@foresite.com -p SecurePass123 -f John -l Doe

    # With custom API URL
    $0 -e admin@foresite.com -p SecurePass123 -f John -l Doe -u https://api.foresite.com/api/v1

    # Using existing admin token
    $0 -e newadmin@foresite.com -p Pass123 -f Jane -l Smith -t eyJhbGc...

Environment Variables:
    API_BASE_URL              Override default API URL

EOF
}

################################################################################
# Main Script Logic
################################################################################

main() {
    local mode="interactive"
    local email=""
    local password=""
    local firstName=""
    local lastName=""
    local phone=""
    local adminToken=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -i|--interactive)
                mode="interactive"
                shift
                ;;
            -e|--email)
                email="$2"
                mode="batch"
                shift 2
                ;;
            -p|--password)
                password="$2"
                shift 2
                ;;
            -f|--first-name)
                firstName="$2"
                shift 2
                ;;
            -l|--last-name)
                lastName="$2"
                shift 2
                ;;
            -n|--phone)
                phone="$2"
                shift 2
                ;;
            -u|--url)
                API_BASE_URL="$2"
                shift 2
                ;;
            -t|--token)
                adminToken="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Execute based on mode
    if [ "$mode" = "interactive" ]; then
        interactive_mode
    else
        if [ -z "$email" ] || [ -z "$password" ] || [ -z "$firstName" ] || [ -z "$lastName" ]; then
            print_error "Missing required arguments for batch mode"
            show_help
            exit 1
        fi
        
        if [ -n "$adminToken" ]; then
            create_admin_direct "$email" "$password" "$firstName" "$lastName" "$phone" "$adminToken"
        else
            batch_mode "$email" "$password" "$firstName" "$lastName" "$phone"
        fi
    fi
}

# Run main function
main "$@"
