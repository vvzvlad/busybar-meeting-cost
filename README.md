# Meeting Cost

The live cost of the meeting you are in.

![Meeting Cost on the BUSY Bar: the total ticking up with 8 people in the meeting](media/running.gif)

Set the hourly rate once in the settings, turn the wheel to the number of people in the room and press Start when the meeting begins. The front display adds up what the meeting costs, second by second, and the back display shows the total in large digits to everyone else at the table.

A JavaScript app for [BUSY Bar](https://busy.app).

## What the bar shows

On start the front display shows a total of zero in the currency of the settings, and under it the headcount and the time: `4 ppl  00:00`. Turning the wheel changes the headcount, from 1 to 99.

![$0, 4 ppl 00:00](media/ready.png)

Start starts the meeting. Once a second the app adds what the people in it have cost at the hourly rate, and the total shows it in whole units of the currency; the time under it runs on: `23:41`, or `1:02:03` past an hour. The wheel changes the headcount during the meeting too: what is spent stays, and the new headcount counts from then on.

The back display shows the total in digits as large as fit, with the currency sign at their top left.

![The back display: $316 in large white digits](media/running-back.png)

Start during the meeting pauses it: the total and the time stand still until the next Start. OK resets the total and the time to zero.

## Buttons

| Button | What it does |
| --- | --- |
| Wheel | Changes the headcount, before and during the meeting. |
| Start | Starts the meeting, pauses it, and goes on after a pause. |
| OK | Stops the meeting and resets the total and the time to zero. |
| Back | Quits the app. |

## Settings

| Setting | What it does |
| --- | --- |
| Hourly rate per person | What one person's hour costs, 1 to 10000. 100 by default. |
| Currency | The sign before the total: USD ($), EUR (€) or GBP (£). USD by default. |
| People by default | The headcount the app starts with, 1 to 99. 4 by default. The wheel changes it until the app is closed. |

The app reads its settings when it starts.

## Data

None: it works offline and keeps nothing on the BUSY Bar.

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
