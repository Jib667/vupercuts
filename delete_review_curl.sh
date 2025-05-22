curl -X DELETE "https://vupercuts.vercel.app/api/reviews/$1" -v -H "Authorization: Basic $(echo -n admin:vupercuts2024 | base64)"
