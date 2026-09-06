// Instellingen van de draaischijf-simulator (/simulatie) voor begeleiders.
// Studenten zien dit niet in de interface: pas de waarden hier aan, commit en
// deploy opnieuw. Ontbreekt een veld (of dit bestand), dan geldt de standaard
// die in simulatie.html staat.
window.SIMULATIE_CONFIG = {
  // Tandwielen tussen servo en schijf: 36 tanden op de servo, 12 op de schijf-as
  // geeft 3. Eén graad servo = 3 graden schijf, dus servo 0-180 draait de schijf
  // 540 graden (1,5 toer) en is de hele schijf bereikbaar. Tandwielen omgewisseld
  // (12 op de servo): 1/3, dan haalt de schijf maar 60 graden.
  overbrenging: 3,

  // +1: een hogere servohoek draait de schijf tegen de klok in (bovenaanzicht),
  // -1: met de klok mee. Hangt af van de montage en van het tandwielpaar.
  richting: 1,

  // Graden waarover de schijf verdraaid op de as gemonteerd is (bij servo 90).
  offset: 0,

  // Positie van de kopjeskant van de brug, tegen de klok in vanaf 3 uur:
  // 270 = onderaan (standaard), 0 = rechts, 90 = boven, 180 = links.
  valopening: 270,

  // Servosnelheid in milliseconden per graad servo (MG90S: ongeveer 20).
  msPerGraad: 20,

  // Uitlijnmarge: hoeveel mm booglengte een open cirkel naast het bakje mag
  // staan voordat de inhoud er nog door valt.
  tolMm: 10,

  // Radiale marge: hoeveel mm een bakje naast de ringstraal mag staan.
  radMm: 7,

  // Lengte van de draai-arm in mm, van de as tot het uiteinde van het vorkje.
  armLengte: 70
};
