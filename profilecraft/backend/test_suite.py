"""
Comprehensive Automated Test Suite for ProfileCraft Backend API and SQLite Database.
"""
import unittest
import json
from app import create_app
from database import db
from models import Profile


class ProfileCraftApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app({'TESTING': True})
        self.client = self.app.test_client()

    def test_health_check(self):
        """Test API health endpoint."""
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('SQLite', data['database'])

    def test_create_profile_success(self):
        """Test successful POST /api/profiles."""
        payload = {
            "name": "Alex Johnson",
            "designation": "Full-Stack Developer",
            "bio": "Passionate developer interested in building modern web applications.",
            "image_url": "https://example.com/profile.jpg",
            "location": "Chennai, India",
            "email": "alex@example.com",
            "skills": ["Python", "React", "JavaScript", "SQL"],
            "linkedin": "https://linkedin.com/in/example",
            "github": "https://github.com/example"
        }
        res = self.client.post('/api/profiles', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], "Profile generated successfully!")
        self.assertIn('id', data['profile'])
        self.assertEqual(data['profile']['name'], "Alex Johnson")
        self.assertEqual(data['profile']['skills'], ["Python", "React", "JavaScript", "SQL"])

    def test_validation_missing_required_fields(self):
        """Test that missing required fields return 400 with specific errors."""
        payload = {
            "name": "",
            "bio": "Short bio"
        }
        res = self.client.post('/api/profiles', json=payload)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])
        self.assertIn('name', data['errors'])
        self.assertIn('email', data['errors'])
        self.assertIn('image_url', data['errors'])

    def test_validation_invalid_email(self):
        """Test that invalid email format returns 400."""
        payload = {
            "name": "Jane Doe",
            "designation": "Designer",
            "bio": "Creative thinker",
            "image_url": "https://example.com/avatar.jpg",
            "location": "Berlin",
            "email": "not-an-email",
            "skills": ["Figma"]
        }
        res = self.client.post('/api/profiles', json=payload)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn('email', data['errors'])

    def test_validation_invalid_url(self):
        """Test that non-http/https URL is rejected."""
        payload = {
            "name": "Jane Doe",
            "designation": "Designer",
            "bio": "Creative thinker",
            "image_url": "javascript:alert(1)",
            "location": "Berlin",
            "email": "jane@example.com",
            "skills": ["Figma"]
        }
        res = self.client.post('/api/profiles', json=payload)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn('image_url', data['errors'])

    def test_get_profiles_and_search(self):
        """Test GET /api/profiles and search filtering."""
        res = self.client.get('/api/profiles')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertGreaterEqual(data['count'], 1)

        # Search by keyword
        res_search = self.client.get('/api/profiles?search=Developer')
        self.assertEqual(res_search.status_code, 200)
        search_data = res_search.get_json()
        self.assertTrue(search_data['success'])

    def test_update_and_delete_profile(self):
        """Test full update (PUT) and delete (DELETE) lifecycle."""
        # Create
        payload = {
            "name": "Lifecycle Test User",
            "designation": "QA Engineer",
            "bio": "Testing lifecycles",
            "image_url": "https://example.com/qa.jpg",
            "location": "Seattle, USA",
            "email": "qa@example.com",
            "skills": ["Pytest", "Selenium"]
        }
        res = self.client.post('/api/profiles', json=payload)
        self.assertEqual(res.status_code, 201)
        created_id = res.get_json()['profile']['id']

        # Update
        update_payload = {"designation": "Senior QA Lead"}
        res_put = self.client.put(f'/api/profiles/{created_id}', json=update_payload)
        self.assertEqual(res_put.status_code, 200)
        self.assertEqual(res_put.get_json()['profile']['designation'], "Senior QA Lead")

        # Delete
        res_del = self.client.delete(f'/api/profiles/{created_id}')
        self.assertEqual(res_del.status_code, 200)

        # Confirm 404
        res_check = self.client.get(f'/api/profiles/{created_id}')
        self.assertEqual(res_check.status_code, 404)


if __name__ == '__main__':
    unittest.main()

