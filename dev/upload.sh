rm -f upload.kv
touch upload.kv
echo "[" >> upload.kv

echo "  {" >> upload.kv
echo "    \"key\": \"hello-world:latest\"," >> upload.kv

echo "    \"value\": \"$(cat ./.mf/kv/hello-world/latest)\"" >> upload.kv
echo "  }," >> upload.kv

# https://developers.cloudflare.com/workers/wrangler/commands/#kvbulk
for file in ./.mf/kv/sha256/*; do
    if [[ -f "$file" && ! "$(basename $file)" == *.* ]]; then
        file=$(basename $file)
        echo "KV: $file"
        echo "  {" >> upload.kv
        echo "    \"key\": \"sha256:$file\"," >> upload.kv
        contents=$(jq -Rs . < ./.mf/kv/sha256/$file)
        echo "    \"value\": \"${contents}\"" >> upload.kv
        echo "  }," >> upload.kv
    fi
done

echo "]" >> upload.kv

npx wrangler kv:bulk put upload.kv --namespace-id=$INSERT_NAMESPACE_HERE

for file in ./.mf/r2/sha256/*; do
    if [[ -f "$file" && ! "$(basename $file)" == *.* ]]; then
        file=$(basename $file)
        echo "R2: $file"
        npx wrangler r2 object put "containerflarer2/sha256:$file" --file "./.mf/r2/sha256/$file"
    fi
done
