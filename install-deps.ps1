$env:PATH = "C:\Users\Usuario\AppData\Roaming\npm;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Usuario\Desktop\Claude\backend"
& "C:\Program Files\nodejs\npm.cmd" install prisma @prisma/client @nestjs/config class-validator class-transformer @nestjs/swagger swagger-ui-express 2>&1
