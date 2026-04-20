#!/bin/bash

# Hironix API Testing Script
# Run this script after starting the backend and frontend servers
# Usage: bash test-api.sh

BASE_URL="http://localhost:5000/api/v1"
ADMIN_TOKEN=""
EMPLOYEE_TOKEN=""
ADMIN_ID=""
EMPLOYEE_ID=""
EMPLOYEE_OBJ_ID=""
ATTENDANCE_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Hironix API Testing Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}TEST 1: Health Check${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/health")
echo "Response: $RESPONSE"
echo ""

# Test 2: Register Admin
echo -e "${BLUE}TEST 2: Register Admin User${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hironix.com",
    "firstName": "Admin",
    "lastName": "User",
    "password": "password123",
    "role": "admin"
  }')
echo "Response: $RESPONSE"
ADMIN_TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
ADMIN_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Admin Token: $ADMIN_TOKEN${NC}\n"

# Test 3: Register Employee
echo -e "${BLUE}TEST 3: Register Employee User${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@hironix.com",
    "firstName": "John",
    "lastName": "Employee",
    "password": "password123",
    "role": "employee"
  }')
echo "Response: $RESPONSE"
EMPLOYEE_TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
EMPLOYEE_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Employee Token: $EMPLOYEE_TOKEN${NC}\n"

# Test 4: Login Admin
echo -e "${BLUE}TEST 4: Login Admin${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hironix.com",
    "password": "password123"
  }')
echo "Response: $RESPONSE"
ADMIN_TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Admin Token: $ADMIN_TOKEN${NC}\n"

# Test 5: Get Current User
echo -e "${BLUE}TEST 5: Get Current User${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 6: Create Employee Record
echo -e "${BLUE}TEST 6: Create Employee Record${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/employees" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"userId\": \"$ADMIN_ID\",
    \"designation\": \"Senior Developer\",
    \"department\": \"Engineering\",
    \"email\": \"dev@company.com\",
    \"phoneNumber\": \"+1234567890\",
    \"dateOfJoining\": \"2023-01-15\",
    \"employmentType\": \"full-time\",
    \"salary\": 120000
  }")
echo "Response: $RESPONSE"
EMPLOYEE_OBJ_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Employee ID: $EMPLOYEE_OBJ_ID${NC}\n"

# Test 7: Get All Employees
echo -e "${BLUE}TEST 7: Get All Employees${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/employees" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 8: Search Employees
echo -e "${BLUE}TEST 8: Search Employees${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/employees?search=dev&department=Engineering" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 9: Get Employee by ID
echo -e "${BLUE}TEST 9: Get Employee by ID${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/employees/$EMPLOYEE_OBJ_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 10: Update Employee
echo -e "${BLUE}TEST 10: Update Employee${NC}"
RESPONSE=$(curl -s -X PUT "$BASE_URL/employees/$EMPLOYEE_OBJ_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "designation": "Lead Developer",
    "salary": 150000
  }')
echo "Response: $RESPONSE\n"

# Test 11: Get Employee Stats
echo -e "${BLUE}TEST 11: Get Employee Statistics${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/employees/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 12: Mark Attendance
echo -e "${BLUE}TEST 12: Mark Attendance${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/attendance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"employeeId\": \"$EMPLOYEE_OBJ_ID\",
    \"date\": \"$(date +%Y-%m-%d)\",
    \"status\": \"present\",
    \"checkInTime\": \"09:00\",
    \"checkOutTime\": \"17:30\"
  }")
echo "Response: $RESPONSE"
ATTENDANCE_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Attendance ID: $ATTENDANCE_ID${NC}\n"

# Test 13: Get Attendance Records
echo -e "${BLUE}TEST 13: Get Attendance Records${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/attendance" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 14: Get Today's Attendance
echo -e "${BLUE}TEST 14: Get Today's Attendance${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/attendance/today" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 15: Get Attendance Summary
echo -e "${BLUE}TEST 15: Get Employee Attendance Summary${NC}"
YEAR=$(date +%Y)
MONTH=$(date +%m)
RESPONSE=$(curl -s -X GET "$BASE_URL/attendance/summary/employee?employeeId=$EMPLOYEE_OBJ_ID&year=$YEAR&month=$MONTH" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 16: Get Organization Attendance Stats
echo -e "${BLUE}TEST 16: Get Organization Attendance Statistics${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/attendance/summary/organization?year=$YEAR&month=$MONTH" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $RESPONSE\n"

# Test 17: Update Attendance
echo -e "${BLUE}TEST 17: Update Attendance${NC}"
RESPONSE=$(curl -s -X PUT "$BASE_URL/attendance/$ATTENDANCE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "late",
    "checkInTime": "09:30"
  }')
echo "Response: $RESPONSE\n"

# Test 18: Duplicate Attendance Prevention
echo -e "${BLUE}TEST 18: Test Duplicate Attendance Prevention${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/attendance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"employeeId\": \"$EMPLOYEE_OBJ_ID\",
    \"date\": \"$(date +%Y-%m-%d)\",
    \"status\": \"absent\"
  }")
echo "Should show error: $RESPONSE\n"

# Test 19: Unauthorized Access (Employee trying to create employee)
echo -e "${BLUE}TEST 19: Test Authorization - Employee cannot create employee${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/employees" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -d '{
    "userId": "test",
    "designation": "Test",
    "department": "Test",
    "email": "test@test.com",
    "dateOfJoining": "2024-01-01"
  }')
echo "Should show 403 error: $RESPONSE\n"

# Test 20: Invalid Login
echo -e "${BLUE}TEST 20: Test Invalid Login${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hironix.com",
    "password": "wrongpassword"
  }')
echo "Should show 401 error: $RESPONSE\n"

# Test 21: Announcement API
echo -e "${BLUE}TEST 21: Create Announcement (Admin)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/announcements" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Welcome to Hironix",
    "message": "This is a test announcement broadcasted to all dashboards.",
    "type": "info"
  }')
echo "Response: $RESPONSE\n"

# Test 22: Payroll API
echo -e "${BLUE}TEST 22: Get Payslip (Employee)${NC}"
YEAR=$(date +%Y)
MONTH=$(date +%m)
RESPONSE=$(curl -s -X GET "$BASE_URL/payroll/my-slip?year=$YEAR&month=$MONTH" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN")
echo "Response: $RESPONSE\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
