### Update JH dependencies

Average savings:

|       | Desktop    | Mobile       |
|-------|------------|--------------|
| ms    | **486.18** | **1489.17**  |
| bytes | **-825.4** | **-641.3**   |

Good saving on time, butat the cost of adding additional bytes, though no more than 1KB. This could probably be included.

### Improve JavaScript Minification

Average savings:

|       | Desktop    | Mobile       |
|-------|------------|--------------|
| ms    | **24.42**  | **-114.42**  |
| bytes | **602.2**  | **553**      |

Small savings on bytes for a slight impact on time to load, at least for mobile devices, and negligible improvements for desktop.

### Investigate code-loading reduction and unused code removal

Average savings:

|       | Desktop    | Mobile       |
|-------|------------|--------------|
| ms    | **-78.25** | **888.66**   |
| bytes | **582.47** | **-1456.6**  |

Impressive-looking saving on desktop bytes, but negated nearly three times over on mobile, where the reduction would be beneficial. Some time saved on mobile loading overall, but less than a second. Also turns out this major upgrade requires a very significant amount of work, and might not even be feasible without a significant rewrite of the underlying PWA infrastructure. Would not recommend following this route; we would be better off to find the improvements elsewhere.

### Grouped improvements - Package updates/JavaScript Minification

Average savings:

|       | Desktop    | Mobile       |
|-------|------------|--------------|
| ms    | **452.65** | **1149.35**  |
| bytes | **-1642**  | **-1458.3**  |

Nice improvement on load times for both desktop and mobile, but at the cost of a lot of unused JavaScript being loaded. An interesting balance.

### Google Maps improvements - _internal_

Started on this then put it on pause following discussions of potentially pairing on it (Slack chat, 18th March); will pick up separately but will probably need more than the initial estimate I provided. Rough estimate instead of ~2d - 4d (I think I spent ~0.75d on this? I can't see my timelogs to check). Suggested solution would be:
* On page load, display a static (JPG/PNG) map from Google
* When the map is scrolled into view, load the interactive map

This should mean there's less content loading particularly on mobile devices on page load, thus improving the page load times - most of the issue seemed to come from the maps themselves.

_dev note:_ https://developers.google.com/maps/documentation/maps-static/start#Markers

### Review and update timer-based events - _internal_

Also paused following discussions of potentially pairing, but seems relatively straightforward, so happy to pick this up once a ticket is in place.

---

### Overview of how these tests were carried out:

These numbers are reviewed across different page types: the **Homepage**, a **PLP**, a **PDP**, a **CMS page** and a **Branch page**. All values were retrieved from Google Chrome's Lighthouse extension; all tests were ran three times per test type (Mobile, Desktop) and per test case to account for the natural variance of page. All were tested against a baseline that was run against the site on the same environment (locally) before any development took place.

Metrics reviewed:
* Total blocking time (ms)
    * Time between first paint and interactive. Good overall metric to test that our code is running swiftly.
    * https://web.dev/lighthouse-total-blocking-time/
* Main Thread Tasks (ms)
    * As per SEL-948; reduce the amount of work that the browser's 'main thread' has to do to get the website working.
    * https://web.dev/mainthread-work-breakdown/
* Long Tasks (ms)
    * Similar to main thread tasks; code functions that take a long time to execute and causes the UI to appear frozen.
    * https://web.dev/long-tasks-devtools/
* Legacy JavaScript (wasted bytes)
    * JavaScript included to help benefit JS execution on older browsers, such as Internet Explorer and Safari 10.
    * https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
* Unused JavaScript (wasted bytes)
    * JavaScript that isn't used on that page, but was loaded anyway.
    * https://web.dev/unused-javascript/
* Unminified JavaScript
    * JavaScript that hasn't been reduced down in order to make it faster for the browser to read.
    * This was also reviewed, however this frequently didn't return anything to compare - most of the issues with this seemed to come from third-party libraries, so there's nothing for us to amend.
