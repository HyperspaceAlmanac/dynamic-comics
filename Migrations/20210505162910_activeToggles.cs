using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class activeToggles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Panels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "ComicActions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "ComicActions");
        }
    }
}
