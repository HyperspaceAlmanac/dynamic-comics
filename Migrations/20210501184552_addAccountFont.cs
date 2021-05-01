using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class addAccountFont : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Font",
                table: "Accounts",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Font",
                table: "Accounts");
        }
    }
}
