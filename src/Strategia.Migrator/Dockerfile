#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/Strategia.Migrator/Strategia.Migrator.csproj", "src/Strategia.Migrator/"]
COPY ["src/Strategia.EntityFrameworkCore/Strategia.EntityFrameworkCore.csproj", "src/Strategia.EntityFrameworkCore/"]
COPY ["src/Strategia.Core/Strategia.Core.csproj", "src/Strategia.Core/"]
COPY ["src/Strategia.Core.Shared/Strategia.Core.Shared.csproj", "src/Strategia.Core.Shared/"]
RUN dotnet restore "src/Strategia.Migrator/Strategia.Migrator.csproj"
COPY . .
WORKDIR "/src/src/Strategia.Migrator"
RUN dotnet build "Strategia.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Strategia.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Strategia.Migrator.dll", "-s"]
