#!/bin/bash

echo "====================================="
echo "Blockchain Attendance System - API Tests"
echo "====================================="
echo ""

API_URL="http://localhost:5000/api"

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

echo "1. Testing System Info..."
curl -s "$API_URL/system/info" | head -20
echo -e "\n"

echo "2. Getting Department Count..."
curl -s "$API_URL/departments" | grep -o '"count":[0-9]*'
echo -e "\n"

echo "3. Getting Class Count..."
curl -s "$API_URL/classes" | grep -o '"count":[0-9]*'
echo -e "\n"

echo "4. Getting Student Count..."
curl -s "$API_URL/students" | grep -o '"count":[0-9]*'
echo -e "\n"

echo "5. Testing a sample student (first student)..."
curl -s "$API_URL/students/DEPT001_CLASS1_STU01" | head -30
echo -e "\n"

echo "6. Marking sample attendance..."
TODAY=$(date +%Y-%m-%d)
curl -s -X POST "$API_URL/attendance/mark" \
  -H "Content-Type: application/json" \
  -d "{\"studentId\":\"DEPT001_CLASS1_STU01\",\"status\":\"Present\",\"date\":\"$TODAY\"}" | head -20
echo -e "\n"

echo "7. Validating blockchain system..."
curl -s "$API_URL/blockchain/validate" | head -50
echo -e "\n"

echo "====================================="
echo "API Tests Complete!"
echo "====================================="
echo ""
echo "To access the web interface, open:"
echo "http://localhost:5000"
echo ""
