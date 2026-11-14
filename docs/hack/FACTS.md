# Facts

Every number shown or said. The code copy lives in `areas/<id>/facts.ts`; this file lists what is
still needed and what must not be said. Open data only.

## Needed (owner finds each one from an official source and opens the link before using it)
| Area | What we need | Where to look |
|---|---|---|
| water | Gallons per person per day, Utah homes; indoor vs outdoor split | Utah Division of Water Resources |
| water | Gallons per square foot of lawn per season | USU Extension, Conserve Water Utah |
| water | Lawn replacement and smart controller rebates | Utah Water Savers |
| water | Great Salt Lake level and healthy range | USGS, Great Salt Lake Strike Team |
| water | Share of Utah water use by sector | Utah Division of Water Resources, USGS |
| energy | Average monthly kWh for a Utah home | EIA |
| energy | Utah power mix and pounds of CO2 per kWh | EIA, EPA eGRID |
| energy | Heating and efficiency rebates | Rocky Mountain Power, Enbridge Gas Utah |
| energy | Water and power use of a data center (for the comparison card) | public reports; say which facility and year |
| air | Emissions per mile for a typical car | EPA |
| air | Today's PM2.5 and PM10 by location | Open-Meteo air quality API, EPA AirNow |
| air | Lakebed dust: what is known about exposure areas | Utah Division of Air Quality, University of Utah reports |
| air | Transit and clean-air programs | UTA, Utah Clean Air Partnership |

## Do not say
| Don't say | Say instead |
|---|---|
| "Your lawn is draining the lake" | "Yards are the part of Utah's water use that households control" |
| Any figure without a `Fact` row | Leave it out |
| "AI calculates your footprint" | "Our formulas do the math. Gemini explains it and cites the sources." |
| "AI-powered" | Say what it does |

## Real vs illustrative
- Real: live lake level and air reading; sourced facts.
- Estimated: household results, computed from the user's six answers and listed assumptions.
- Not stored: answers stay in the browser. Only the computed results and the question are sent to Gemini.
