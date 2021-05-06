using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class commentUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Comments",
                table: "Comments");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                table: "Comments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CommentorId",
                table: "Comments",
                column: "CommentorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Comments",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_CommentorId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Comments");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                table: "Comments",
                columns: new[] { "CommentorId", "PanelId" });
        }
    }
}
