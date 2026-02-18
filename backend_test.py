#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class GlobalNewsNavigatorTester:
    def __init__(self, base_url="https://news-by-nation.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_newspaper_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")

            return success, response.json() if response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_verify_token(self):
        """Test token verification"""
        if not self.token:
            print("❌ No token available for verification")
            return False
            
        success, _ = self.run_test(
            "Token Verification",
            "GET",
            "auth/verify",
            200,
            auth_required=True
        )
        return success

    def test_get_all_newspapers(self):
        """Test getting all newspapers"""
        success, response = self.run_test(
            "Get All Newspapers",
            "GET",
            "newspapers",
            200
        )
        return success

    def test_create_newspaper(self):
        """Test creating a newspaper"""
        test_data = {
            "title": "Test Newspaper",
            "url": "https://test-newspaper.com",
            "country_code": "USA"
        }
        
        success, response = self.run_test(
            "Create Newspaper",
            "POST",
            "newspapers",
            200,
            data=test_data,
            auth_required=True
        )
        
        if success and 'id' in response:
            self.created_newspaper_id = response['id']
            print(f"   Created newspaper ID: {self.created_newspaper_id}")
        
        return success

    def test_get_newspapers_by_country(self):
        """Test getting newspapers by country"""
        success, _ = self.run_test(
            "Get Newspapers by Country (USA)",
            "GET",
            "newspapers/country/USA",
            200
        )
        return success

    def test_update_newspaper(self):
        """Test updating a newspaper"""
        if not self.created_newspaper_id:
            print("❌ No newspaper ID available for update")
            return False
            
        update_data = {
            "title": "Updated Test Newspaper",
            "url": "https://updated-test-newspaper.com"
        }
        
        success, _ = self.run_test(
            "Update Newspaper",
            "PUT",
            f"newspapers/{self.created_newspaper_id}",
            200,
            data=update_data,
            auth_required=True
        )
        return success

    def test_get_countries(self):
        """Test getting countries with newspapers"""
        success, _ = self.run_test(
            "Get Countries with Newspapers",
            "GET",
            "countries",
            200
        )
        return success

    def test_delete_newspaper(self):
        """Test deleting a newspaper"""
        if not self.created_newspaper_id:
            print("❌ No newspaper ID available for deletion")
            return False
            
        success, _ = self.run_test(
            "Delete Newspaper",
            "DELETE",
            f"newspapers/{self.created_newspaper_id}",
            200,
            auth_required=True
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        # Test creating newspaper without token
        test_data = {
            "title": "Unauthorized Test",
            "url": "https://test.com",
            "country_code": "USA"
        }
        
        success, _ = self.run_test(
            "Unauthorized Create Newspaper",
            "POST",
            "newspapers",
            401,  # Expecting Unauthorized
            data=test_data,
            auth_required=False
        )
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        success, _ = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,  # Expecting Unauthorized
            data={"username": "invalid", "password": "invalid"}
        )
        return success

def main():
    print("🚀 Starting Global News Navigator API Tests")
    print("=" * 50)
    
    tester = GlobalNewsNavigatorTester()
    
    # Test sequence
    test_results = []
    
    # Authentication tests
    print("\n📝 AUTHENTICATION TESTS")
    test_results.append(("Invalid Login", tester.test_invalid_login()))
    test_results.append(("Admin Login", tester.test_login()))
    test_results.append(("Token Verification", tester.test_verify_token()))
    
    # Public endpoint tests
    print("\n📝 PUBLIC ENDPOINT TESTS")
    test_results.append(("Get All Newspapers", tester.test_get_all_newspapers()))
    test_results.append(("Get Countries", tester.test_get_countries()))
    test_results.append(("Get Newspapers by Country", tester.test_get_newspapers_by_country()))
    
    # Protected endpoint tests
    print("\n📝 PROTECTED ENDPOINT TESTS")
    test_results.append(("Unauthorized Access", tester.test_unauthorized_access()))
    test_results.append(("Create Newspaper", tester.test_create_newspaper()))
    test_results.append(("Update Newspaper", tester.test_update_newspaper()))
    test_results.append(("Delete Newspaper", tester.test_delete_newspaper()))

    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    
    failed_tests = []
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if not result:
            failed_tests.append(test_name)
    
    print(f"\n📈 Summary: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if failed_tests:
        print(f"\n❌ Failed tests:")
        for test in failed_tests:
            print(f"   • {test}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n🎯 Success rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())