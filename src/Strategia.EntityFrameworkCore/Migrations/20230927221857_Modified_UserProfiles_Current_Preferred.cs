using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Modified_UserProfiles_Current_Preferred : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentIndustry",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentLocation",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentRole",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentSalaryBandHigh",
                table: "strUserProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentSalaryBandLow",
                table: "strUserProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PreferredIndustry",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredLocation",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredRole",
                table: "strUserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreferredSalaryBandHigh",
                table: "strUserProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PreferredSalaryBandLow",
                table: "strUserProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentIndustry",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "CurrentLocation",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "CurrentRole",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "CurrentSalaryBandHigh",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "CurrentSalaryBandLow",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "PreferredIndustry",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "PreferredLocation",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "PreferredRole",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "PreferredSalaryBandHigh",
                table: "strUserProfiles");

            migrationBuilder.DropColumn(
                name: "PreferredSalaryBandLow",
                table: "strUserProfiles");
        }
    }
}
