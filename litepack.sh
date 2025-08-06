#!/bin/bash

shopt -s globstar

# find "Asset Pack V2/" -iname "*.DELETE*" -delete

# Asset Pack v2 has to be transformed to work in the webapp

# The root folder containing "Asset Pack V2"
assetdirsroot="/cygdrive/d/UHC"

# The root address of the webserver hosting the files
ASSET_PACK_HREF="https://filedn.com/.../AssetPackV2Lite/"

# Duplicate asset pack
copyPack() {

	rsync -ria "${assetdirsroot}/Asset Pack V2/" "${assetdirsroot}/AssetPackV2Lite/" \
		--delete-during \
		--exclude "mods" \
		--no-p --no-g --chmod=ugo=rwX

		# --exclude "tiby/*.mp3" \
		# --exclude "Booklet.pdf" \
		# --exclude "Squiddles_booklet.pdf" \
		# --exclude "Fly-CUDkBTYWtGk.mp4" \
		# --exclude "namcohigh/game" \
		# --exclude "GENFROGBOOKLETSMALL.pdf" \
		# --exclude "miracles.mp4" \
		# --exclude "advimgs" \
		# --exclude "storyfiles" \
		# --exclude "ryanquest" \
		# --delete-excluded

	# TODO: tbiy exclude rule does not work

}

# --exclude "comics/pxs/*/"

# Copy imods to WAP
copyImods() {
	rsync -ria --delete-after "unofficial-homestuck-collection/src/imods/" "${assetdirsroot}/AssetPackV2Lite/archive/imods/"
}


fixOB() {

	for ob in 04106 08080 08120 scraps; do
		(
		mkdir -p "${assetdirsroot}/AssetPackV2Lite/storyfiles/hs2/$ob/"
		rsync -ria "${assetdirsroot}/Asset Pack V2/storyfiles/hs2/$ob/" "${assetdirsroot}/AssetPackV2Lite/storyfiles/hs2/$ob/"
		) &
	done
	for ob in 05305 05395 05260; do
		(
		mkdir -p "${assetdirsroot}/AssetPackV2Lite/storyfiles/hs2/$ob/"
		rsync -ria "${assetdirsroot}/Asset Pack V2/storyfiles/hs2/$ob/" "${assetdirsroot}/AssetPackV2Lite/storyfiles/hs2/$ob/"
		sed -i "s|assets://storyfiles/hs2/$ob/|./|g" "${assetdirsroot}/AssetPackV2Lite/storyfiles/hs2/$ob/"**/*ml
		) &
	done
	wait
}

copyMods() {
	mkdir -p "${assetdirsroot}/AssetPackV2Lite/mods/"

	# CHANGEME
	for dir in \
		"click.js" \
		; do
		rsync -rit "${assetdirsroot}/Asset Pack V2/mods/${dir}" "${assetdirsroot}/AssetPackV2Lite/mods/" --exclude ".git" --copy-links
	done
}

postprocessMods() {
	for modjs in ${assetdirsroot}/AssetPackV2Lite/mods/*.js \
		${assetdirsroot}/AssetPackV2Lite/mods/*/mod.js \
		${assetdirsroot}/AssetPackV2Lite/archive/imods/*.js \
		${assetdirsroot}/AssetPackV2Lite/archive/imods/*/mod.js; do
		(
		sed -i -E "s|api.readJson\('(.+)'\)|require('\1')|g" "$modjs"
		sed -i -E 's|api.readJson\("(.+)"\)|require("\1")|g' "$modjs"
		sed -i -E "s|api.readYaml\('(.+)'\)|require('\!yaml-loader\!\1').default|g" "$modjs"
		sed -i -E 's|api.readYaml\("(.+)"\)|require("\!yaml-loader\!\1").default|g' "$modjs"
		sed -i -E "s|api.readFile\('(.+)'\)|require('\!raw-loader\!\1').default|g" "$modjs"
		sed -i -E 's|api.readFile\("(.+)"\)|require("\!raw-loader\!\1").default|g' "$modjs"

		sed -i -E "s|await api.readJsonAsync\('(.+)'\)|(await import('\1'))\?.default|g" "$modjs"
		sed -i -E 's|await api.readJsonAsync\("(.+)"\)|(await import("\1"))\?.default|g' "$modjs"
		sed -i -E "s|await api.readYamlAsync\('(.+)'\)|(await import('\!yaml-loader\!\1')).default|g" "$modjs"
		sed -i -E 's|await api.readYamlAsync\("(.+)"\)|(await import("\!yaml-loader\!\1")).default|g' "$modjs"
		sed -i -E "s|await api.readFileAsync\('(.+)'\)|(await import('\!raw-loader\!\1')).default|g" "$modjs"
		sed -i -E 's|await api.readFileAsync\("(.+)"\)|(await import("\!raw-loader\!\1")).default|g' "$modjs"
		) &
	done
	wait
}

# exit

# Host asset pack resources on ASSET_PACK_HREF
copyPcloud() {

	echo Synchronizing pCloud

	pCloudRoot="/cygdrive/p/Public Folder/AssetPackV2Lite"

	rsync -ria --delete-after --size-only "${assetdirsroot}/AssetPackV2Lite/" "$pCloudRoot/" \
		--delete-excluded \
		--exclude "data/plugins"

}
# Manual rewrites

# for ob in 05260 05305 05395; do
# 	mkdir -p "$pCloudRoot/storyfiles/hs2/$ob/"
# 	cat "Asset Pack V2/storyfiles/hs2/$ob/$ob.html" \
# 	| sed "s|assets://|${ASSET_PACK_HREF}|g" > "$pCloudRoot/storyfiles/hs2/$ob/$ob.html"
# done

if [ "${BASH_SOURCE[0]}" -ef "$0" ]
then
	echo Building AssetPackV2Lite
	copyPack

	echo copyImods and fixOB and copyMods
	copyImods &
	fixOB &
	copyMods &
	wait

	postprocessMods

	echo copyPcloud
	copyPcloud
fi
