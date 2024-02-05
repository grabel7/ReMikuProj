# Estágio 1: Construir o Front-end
FROM node:14-alpine AS front-end
WORKDIR /app/front

COPY ReMikuProj/Front/package*.json ./
RUN npm install

COPY ReMikuProj/Front/ .
RUN npm run build

# Estágio 2: Construir o Back-end
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS back-end
WORKDIR /app/back

COPY ReMikuProj/Back/mikuProj.API/*.csproj ./
RUN dotnet restore

COPY ReMikuProj/Back/mikuProj.API/ .
RUN dotnet publish -c Release -o out

# Estágio 3: Juntar os Estágios Anteriores
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app

COPY --from=front-end /app/front/dist /app/wwwroot
COPY --from=back-end /app/back/out /app

ENTRYPOINT ["dotnet", "mikuProj.API.dll"]
