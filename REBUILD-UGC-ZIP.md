# Rebuild Instructions

The UGC backup ZIP is split into numbered parts because GitHub blocks files over 100 MB.

To rebuild on Windows PowerShell from this folder:

```powershell
Get-Content -Encoding Byte -ReadCount 0 .\Nexovia-UGC-Content-drive-backup.zip.part* | Set-Content -Encoding Byte Nexovia-UGC-Content-drive-backup.zip
```

Then unzip `Nexovia-UGC-Content-drive-backup.zip` normally.
