# Meeting Cost

The live cost of the meeting you are in, ticking up on your BUSY Bar.

A JavaScript app for [BUSY Bar](https://busy.app). Work in progress.

## What it does

- Turn the wheel to set how many people are in the meeting, before or during it. Start starts and pauses, OK resets.
- The front display shows the total in large digits and, under it, the headcount and the elapsed time: `8 ppl  23:41`.
- The back display shows the total too, so your colleagues can see it.
- Settings: hourly rate per person, currency (USD, EUR, GBP), default headcount.

## Data

None: it works offline.

## Build

Node 24 and npm:

```sh
npm ci
npm run build         # dist/io.github.vvzvlad.meetingcost.tgz
npm run app:install   # install it on a BUSY Bar connected over USB
npm run app:run       # start it
```

## License

[MIT](LICENSE)
