#!/bin/bash

# Script to test review deletion functionality

# Set the base URL - modify as needed
BASE_URL="https://vupercuts.vercel.app"

# Admin credentials
USERNAME="admin"
PASSWORD="vupercuts2024"

# First, get the current reviews
echo "Fetching current reviews..."
REVIEWS_RESPONSE=$(curl -s "${BASE_URL}/api/reviews?t=$(date +%s)")

# Check if reviews were fetched
if [ -z "$REVIEWS_RESPONSE" ]; then
  echo "Error: Could not fetch reviews"
  exit 1
fi

# Extract review IDs - requires jq
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required for this script. Please install it."
  exit 1
fi

# Extract the reviews array
REVIEWS=$(echo "$REVIEWS_RESPONSE" | jq -r '.reviews')
REVIEW_COUNT=$(echo "$REVIEWS" | jq 'length')

echo "Found $REVIEW_COUNT reviews"

# List the reviews
echo "Available reviews:"
echo "$REVIEWS" | jq -r '.[] | "ID: \(.id) - \(.name) - Rating: \(.rating) - \(.text | substr(0, 30))..."'

# Ask which review to delete
echo ""
echo "Enter the ID of the review to delete (or 'all' to nuke all reviews):"
read REVIEW_ID

if [ "$REVIEW_ID" = "all" ]; then
  echo "Nuking all reviews..."
  NUKE_RESPONSE=$(curl -s "${BASE_URL}/api/nuke-reviews?t=$(date +%s)")
  echo "Nuke response: $NUKE_RESPONSE"
  
  echo "Verifying all reviews are gone..."
  sleep 1
  VERIFY_RESPONSE=$(curl -s "${BASE_URL}/api/reviews?t=$(date +%s)")
  REVIEW_COUNT=$(echo "$VERIFY_RESPONSE" | jq '.totalReviews')
  echo "Reviews remaining: $REVIEW_COUNT"
  
  exit 0
fi

# Delete the selected review
echo "Deleting review with ID: $REVIEW_ID"
DELETE_RESPONSE=$(curl -s -X DELETE \
  -H "Authorization: Basic $(echo -n "${USERNAME}:${PASSWORD}" | base64)" \
  -H "Cache-Control: no-cache" \
  "${BASE_URL}/api/reviews/${REVIEW_ID}?t=$(date +%s)")

echo "Delete response:"
echo "$DELETE_RESPONSE" | jq

# Verify the review is gone
echo "Verifying deletion..."
sleep 1
VERIFY_RESPONSE=$(curl -s "${BASE_URL}/api/reviews?t=$(date +%s.$(date +%N))" \
  -H "Cache-Control: no-cache, no-store" \
  -H "Pragma: no-cache")

# Check if the review is still there
REVIEW_STILL_EXISTS=$(echo "$VERIFY_RESPONSE" | jq -r '.reviews[] | select(.id=="'"$REVIEW_ID"'") | .id')

if [ -z "$REVIEW_STILL_EXISTS" ]; then
  echo "Success! Review with ID $REVIEW_ID was deleted successfully."
else
  echo "Error: Review with ID $REVIEW_ID still exists after deletion attempt."
  echo "Current reviews:"
  echo "$VERIFY_RESPONSE" | jq '.reviews'
fi 