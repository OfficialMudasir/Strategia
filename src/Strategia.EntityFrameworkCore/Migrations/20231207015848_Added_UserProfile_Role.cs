using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Added_UserProfile_Role : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileRole",
                table: "strUserProfiles",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileRole",
                table: "strUserProfiles");
        }
    }
}
