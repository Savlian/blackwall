#!/usr/bin/env bash
# TODO: remove dependency on jq
command -v "jq" &> /dev/null || { echo "update_cinny.sh: jq is not installed"; exit; }

# this script will automatically download the latest release of cinny and unpack it for you
# it will preserve your current configuration file, and optionally inject custom css

# ASSUMPTIONS:
#  * this script is located next to a dist/ folder, where cinny is served from
#  * this script is executed by the same user as that owns that dist/ directory

echo "have you read the changelog?"
echo "⇒ https://github.com/cinnyapp/cinny/releases/latest"
echo -n "(y/n) "
old_stty_cfg=$(stty -g)
stty raw -echo ; answer=$(head -c 1) ; stty $old_stty_cfg
if [ "$answer" == "${answer#[Yy]}" ]; then
	echo "cancelling upgrade!"
	exit
fi

echo "upgrading cinny"

echo "→ purging old version..."
[[ -e dist ]] && cp dist/config.json ./
[[ -e dist/custom.css ]] && cp dist/custom.css ./
rm -f cinny*.tar.gz
rm -rf dist/

echo "→ getting latest version..."
latest=$(curl https://api.github.com/repos/cinnyapp/cinny/releases/latest)
wget -nv $(echo "$latest" | jq -r '.assets[0].browser_download_url')

echo "→ unpacking the cinny..."
tar -xf cinny*.tar.gz

echo "→ replacing config...."
cp config.json dist/

if [ -e custom.css  ]; then
	echo "→ injecting css..."
	cp custom.css dist/
	sed -i 's|<head>|<head>\n    <link rel="stylesheet" href="/custom.css">|' dist/index.html
fi

echo "cinny upgraded to $(echo "$latest" | jq -r '.tag_name')!"
