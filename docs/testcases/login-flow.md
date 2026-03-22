# Testcases: Login-Flow (OIDC / Keycloak)

> **Status:** Manuell auszufuehren – Playwright ist im Projekt noch nicht eingerichtet.
> Sobald Playwright installiert ist, koennen die Testfaelle in `frontend/e2e/auth.spec.ts`
> automatisiert werden.

## Voraussetzungen (alle Testfaelle)

- `docker compose up --wait` gestartet (Keycloak auf Port 8180, Frontend auf Port 3000)
- Keycloak-Realm `nextuntis` mit Client `nextuntis-frontend` importiert
- Testuser vorhanden: Benutzername `testuser`, Passwort `testpass`
- Browser-LocalStorage geleert bzw. kein aktiver OIDC-Token

---

## TC-001: Nicht-authentifizierter Zugriff auf /students

**Ziel:** Sicherstellen, dass geschuetzte Routen unauthentizierte Nutzer zur Login-Seite weiterleiten.

**Voraussetzungen:**
- Kein gueltiger Token im LocalStorage
- Frontend erreichbar unter `http://localhost:3000`

**Testdaten:** keine

**Ablauf:**
1. Browser-LocalStorage leeren (DevTools > Application > Storage > Clear site data)
2. `http://localhost:3000/students` direkt aufrufen

**Erwartetes Ergebnis:**
- Browser landet auf `/login` (Redirect durch `ProtectedRoute`)
- Die Login-Seite zeigt den Button "Mit Keycloak anmelden"
- Die URL im Browser ist `http://localhost:3000/login`

---

## TC-002: Klick auf "Mit Keycloak anmelden" leitet zu Keycloak weiter

**Ziel:** Sicherstellen, dass der Login-Button den OIDC-Authorization-Code-Flow startet.

**Voraussetzungen:**
- Nutzer befindet sich auf `/login`
- Kein gueltiger Token im LocalStorage

**Testdaten:** keine

**Ablauf:**
1. `http://localhost:3000/login` aufrufen
2. Button "Mit Keycloak anmelden" klicken

**Erwartetes Ergebnis:**
- Browser wird zu Keycloak weitergeleitet (URL beginnt mit `http://localhost:8180/realms/nextuntis/protocol/openid-connect/auth`)
- Die Keycloak-Login-Seite ist sichtbar (Felder fuer Benutzername und Passwort)
- URL-Parameter `client_id=nextuntis-frontend` und `redirect_uri=http://localhost:3000/callback` sind enthalten

---

## TC-003: Erfolgreicher Login mit testuser/testpass

**Ziel:** Sicherstellen, dass ein gueltiger Login den Nutzer zur Schueler-Liste weiterleitet.

**Voraussetzungen:**
- Nutzer wurde von `/login` zu Keycloak weitergeleitet (siehe TC-002)
- Testuser `testuser` / `testpass` existiert im Realm

**Testdaten:**
- Benutzername: `testuser`
- Passwort: `testpass`

**Ablauf:**
1. Keycloak-Login-Seite aufgerufen (nach TC-002)
2. Benutzername `testuser` eingeben
3. Passwort `testpass` eingeben
4. Login-Button klicken

**Erwartetes Ergebnis:**
- Keycloak redirectet zu `http://localhost:3000/callback` (mit `code`-Parameter)
- `AuthCallbackPage` zeigt kurz den Ladeindikator ("Anmeldung wird verarbeitet...")
- Nach Token-Austausch automatischer Redirect zu `/students`
- Die Schueler-Liste (`StudentListPage`) ist sichtbar
- Im LocalStorage existiert ein Eintrag mit dem OIDC-Token (Key beginnt mit `oidc.user:`)

---

## TC-004: Seite nach Login neu laden – Nutzer bleibt eingeloggt

**Ziel:** Sicherstellen, dass der Token aus dem LocalStorage wiederhergestellt wird und kein erneuter Login noetig ist.

**Voraussetzungen:**
- TC-003 erfolgreich abgeschlossen
- Nutzer befindet sich auf `/students`
- OIDC-Token ist im LocalStorage gespeichert

**Testdaten:** keine

**Ablauf:**
1. Waehrend der Nutzer auf `/students` ist, Seite neu laden (F5 / Cmd+R)

**Erwartetes Ergebnis:**
- Kein Redirect zu `/login`
- Die Schueler-Liste wird direkt angezeigt
- Der LocalStorage-Token bleibt unveraendert erhalten
- Kein erneuter Keycloak-Aufruf (kein externer Redirect sichtbar)

---

## TC-005: Logout leitet zu /login weiter

**Ziel:** Sicherstellen, dass ein Logout den Token invalidiert und den Nutzer zur Login-Seite schickt.

**Voraussetzungen:**
- TC-003 erfolgreich abgeschlossen (Nutzer ist eingeloggt)
- Ein Logout-Mechanismus ist im UI erreichbar (Button oder Menueintrag)

**Testdaten:** keine

**Ablauf:**
1. Logout-Button / -Menueintrag klicken
2. Ggf. Keycloak-Logout-Seite bestaetigen (falls vorhanden)

**Erwartetes Ergebnis:**
- Browser landet auf `http://localhost:3000/login`
- Der OIDC-Token ist aus dem LocalStorage entfernt
- Ein erneuter Aufruf von `/students` redirectet wieder zu `/login`

> **Hinweis:** Falls kein Logout-Button im UI implementiert ist, ist TC-005 als
> "nicht testbar / offen" zu markieren. Die OIDC-Konfiguration sieht
> `post_logout_redirect_uri: http://localhost:3000/login` vor, der Trigger fehlt aber
> moeglicherweise noch im Frontend.

---

## Automatisierung mit Playwright (ausstehend)

Playwright ist aktuell **nicht** im Projekt konfiguriert (`playwright` fehlt in
`frontend/package.json`). Alle fuenf Testfaelle muessen derzeit **manuell** ausgefuehrt
werden.

Wenn Playwright eingerichtet wird, empfiehlt sich folgendes Setup:

```
frontend/
  e2e/
    auth.spec.ts              # TC-001 bis TC-005
    pages/
      LoginPage.ts            # Page Object: /login
      KeycloakLoginPage.ts    # Page Object: Keycloak-Login-Formular
      StudentsPage.ts         # Page Object: /students
playwright.config.ts          # baseURL: http://localhost:3000
                              # webServer: docker compose up --wait
```

Der Keycloak-Login-Redirect muss dabei vollstaendig im Browser durchlaufen werden
(kein Mocking), da `react-oidc-context` echte Token benoetigt. Keycloak muss
waehrend der Testablaeufe laufen.
