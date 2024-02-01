using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Added_UserProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "strUserProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    ProfileName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    ProfileDescription = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    Resume = table.Column<byte>(type: "tinyint", nullable: false),
                    ParsedResume = table.Column<string>(type: "nvarchar(max)", maxLength: 32768, nullable: true),
                    Archive = table.Column<bool>(type: "bit", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_strUserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_strUserProfiles_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_strUserProfiles_TenantId",
                table: "strUserProfiles",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_strUserProfiles_UserId",
                table: "strUserProfiles",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "strUserProfiles");
        }
    }
}
