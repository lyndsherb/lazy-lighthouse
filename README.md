# Lighthouse JSON data-getter

Lazy Lighthouse data getter to get only a set of performance metrics from any given Lighthouse JSON file.

## Expectations

Only returns the following values from Lighthouse:

* `total-blocking-time`
* `mainthread-work-breakdown`
* `third-party-summary`
* `long-tasks`
* `legacy-javascript`
* `unused-javascript`
* `unminified-javascript`

Expects 3 of each file for both Mobile and Desktop _unless custom data is passed in_:
* desk-[01, 02, 03].json
* mob-[01, 02, 03].json

Raw data folder is `./raw/` - **not committed**
'Formatted' data folder is `./formatted/` - **not committed**

Default folder to check is `Before/Homepage`

CLI args:

| Argument | Default | Description |
|----------|---------|-------------|
| type     | Before  | Type of file we're checking - `Before` or `After` |
| group    | Homepage| Group of files to check - `Homepage`, `PLP` etc   |
| site     | Local   | Site to check - `Local`, `Develop`, `Staging`, `Prod` |
| files    | null    | Files to check - overrides defaults. Pass a quoted string in e.g. `files="file-1.json file-2.json"` |
