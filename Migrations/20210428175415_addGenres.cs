using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class addGenres : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrimaryGenre",
                table: "Comics",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryGenre",
                table: "Comics",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrimaryGenre",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "SecondaryGenre",
                table: "Comics");
        }
    }
}
