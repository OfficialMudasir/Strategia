using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Added_Courses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "strCourses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    TitleVideo = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    TitleImage = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
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
                    table.PrimaryKey("PK_strCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_strCourses_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "strCourseLessons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TitleImage = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    TitleVideo = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_strCourseLessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_strCourseLessons_strCourses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "strCourses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "strCourseLessonActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActivityType = table.Column<int>(type: "int", nullable: false),
                    TitleImage = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    TitleVideo = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CourseLessonId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_strCourseLessonActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_strCourseLessonActivities_strCourseLessons_CourseLessonId",
                        column: x => x.CourseLessonId,
                        principalTable: "strCourseLessons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_strCourseLessonActivities_CourseLessonId",
                table: "strCourseLessonActivities",
                column: "CourseLessonId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseLessonActivities_TenantId",
                table: "strCourseLessonActivities",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseLessons_CourseId",
                table: "strCourseLessons",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseLessons_TenantId",
                table: "strCourseLessons",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourses_TenantId",
                table: "strCourses",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourses_UserId",
                table: "strCourses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "strCourseLessonActivities");

            migrationBuilder.DropTable(
                name: "strCourseLessons");

            migrationBuilder.DropTable(
                name: "strCourses");
        }
    }
}
