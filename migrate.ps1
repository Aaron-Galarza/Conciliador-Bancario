$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
Write-Host "Creando base de datos y aplicando migraciones..."
& "C:\Program Files\nodejs\npx.cmd" prisma migrate dev --name init 2>&1
