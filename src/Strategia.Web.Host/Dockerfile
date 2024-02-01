#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/Strategia.Web.Host/Strategia.Web.Host.csproj", "src/Strategia.Web.Host/"]
COPY ["src/Strategia.Web.Core/Strategia.Web.Core.csproj", "src/Strategia.Web.Core/"]
COPY ["src/Strategia.Application/Strategia.Application.csproj", "src/Strategia.Application/"]
COPY ["src/Strategia.Application.Shared/Strategia.Application.Shared.csproj", "src/Strategia.Application.Shared/"]
COPY ["src/Strategia.Core.Shared/Strategia.Core.Shared.csproj", "src/Strategia.Core.Shared/"]
COPY ["src/Strategia.Core/Strategia.Core.csproj", "src/Strategia.Core/"]
COPY ["src/Strategia.EntityFrameworkCore/Strategia.EntityFrameworkCore.csproj", "src/Strategia.EntityFrameworkCore/"]
COPY ["src/Strategia.GraphQL/Strategia.GraphQL.csproj", "src/Strategia.GraphQL/"]
RUN dotnet restore "src/Strategia.Web.Host/Strategia.Web.Host.csproj"
COPY . .
WORKDIR "/src/src/Strategia.Web.Host"
RUN dotnet build "Strategia.Web.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Strategia.Web.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Strategia.Web.Host.dll"]
