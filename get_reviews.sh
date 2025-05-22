curl -s "https://vupercuts.vercel.app/api/reviews" | jq ".reviews[] | {id, name, text: (.text | if length > 30 then (.text[0:30] + \"...\") else . end)}"
