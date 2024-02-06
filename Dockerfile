# Estágio 1: Construir o Front-end
FROM node:20 AS front-end
WORKDIR /app/front

COPY Front/package*.json ./
RUN npm install

COPY Front/ .
RUN npm run build

# Estágio 2: Construir o Back-end
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS back-end
WORKDIR /app/back

COPY Back/mikuProj.API/*.csproj ./
RUN dotnet restore

COPY Back/mikuProj.API/ .
RUN dotnet publish -c Release -o out

# Estágio 3: Juntar os Estágios Anteriores
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

# Adicione a instrução para configurar a porta
ENV ASPNETCORE_URLS=http://+:5098

COPY --from=front-end /app/front/dist /app/wwwroot
COPY --from=back-end /app/back/out /app

ENTRYPOINT ["dotnet", "mikuProj.API.dll"]
