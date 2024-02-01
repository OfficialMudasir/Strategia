using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strategia.Migrations
{
    /// <inheritdoc />
    public partial class Added_Course_User : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "strCourseUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    CourseTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseCompletedTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseLessonTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseLessonCompletedTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseLessonActivityTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseLessonActivityCompletedTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CourseLessonId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CourseLessonActivityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_strCourseUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_strCourseUsers_strCourseLessonActivities_CourseLessonActivityId",
                        column: x => x.CourseLessonActivityId,
                        principalTable: "strCourseLessonActivities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_strCourseUsers_strCourseLessons_CourseLessonId",
                        column: x => x.CourseLessonId,
                        principalTable: "strCourseLessons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_strCourseUsers_strCourses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "strCourses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_strCourseUsers_strUserProfiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "strUserProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_strCourseUsers_CourseId",
                table: "strCourseUsers",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseUsers_CourseLessonActivityId",
                table: "strCourseUsers",
                column: "CourseLessonActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseUsers_CourseLessonId",
                table: "strCourseUsers",
                column: "CourseLessonId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseUsers_TenantId",
                table: "strCourseUsers",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_strCourseUsers_UserProfileId",
                table: "strCourseUsers",
                column: "UserProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "strCourseUsers");
        }
    }
}
