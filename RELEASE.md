# Release procedure

Notes for maintaining repository release cadence:

1. Update version number in `package.json`. (Must at least bump patch version.)
2. Merge update into develop (for prerelease) or master (for full release) to trigger build workflow.
3. Write release notes and publish the draft release created by the workflow
4. Update flatpak metadata info (see `just xml_release`)
5. Commit updated flatpak metadata to `origin/develop`
6. Create pull request against flatpak repo (`see just flatpak`) using latest gh release for the asset and the latest `origin/develop` metadata for release notes.
