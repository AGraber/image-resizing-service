# image-resizing-service
Beispiel für einen Dienst zur Größenänderung von Bildern, der im Rahmen eines Evaluierungsprojekts erstellt wurde.
Geschrieben in TypeScript für Node JS.

# Schnellstart
Sie können docker-compose verwenden, um dieses Projekt schnell in Port 8080 zum Laufen zu bringen:
```
docker-compose up
```

Alternativ dazu können Sie die Umgebungsvariablen entsprechend konfigurieren (siehe Datei `.env.example`) und mit den folgenden Befehlen manuell erstellen und starten (erfordert installiertes NodeJS):

```
npm i # dependencies installieren
npm run start # build und starten
```

# Caches
Es sind 2 Arten von Bild-Caching implementiert:
- Dateisystem-Cache
- MariaDB / MySQL-Cache

Der Code verwendet derzeit nur MariaDB, aber das kann mit ein paar Zeilen Code in `/src/cacheStorage/index.ts` trivial geändert werden.
Eine Cache-Schnittstelle ist definiert, so dass die Implementierung einer anderen Art von Cache-Speicher einfach ist.
