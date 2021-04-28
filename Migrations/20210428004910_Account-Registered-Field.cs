using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class AccountRegisteredField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "userName",
                table: "Accounts",
                newName: "UserName");

            migrationBuilder.AddColumn<bool>(
                name: "Registered",
                table: "Accounts",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Registered",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Accounts",
                newName: "userName");
        }
    }
}
