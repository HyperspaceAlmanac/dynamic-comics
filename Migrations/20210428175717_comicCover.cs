using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class comicCover : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ComicCoverId",
                table: "Comics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Comics_ComicCoverId",
                table: "Comics",
                column: "ComicCoverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comics_Resources_ComicCoverId",
                table: "Comics",
                column: "ComicCoverId",
                principalTable: "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comics_Resources_ComicCoverId",
                table: "Comics");

            migrationBuilder.DropIndex(
                name: "IX_Comics_ComicCoverId",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "ComicCoverId",
                table: "Comics");
        }
    }
}
