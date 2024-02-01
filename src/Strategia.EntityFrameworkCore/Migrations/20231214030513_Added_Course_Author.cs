using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Added_Course_Author : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorDescription",
                table: "strCourses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "strCourses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AuthorProfilePictureId",
                table: "strCourses",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorDescription",
                table: "strCourses");

            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "strCourses");

            migrationBuilder.DropColumn(
                name: "AuthorProfilePictureId",
                table: "strCourses");
        }
    }
}
