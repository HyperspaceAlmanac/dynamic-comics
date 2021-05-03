using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class simplifyDonations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Refund",
                table: "Tips");

            migrationBuilder.DropColumn(
                name: "RequestId",
                table: "Tips");

            migrationBuilder.DropColumn(
                name: "Success",
                table: "Tips");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Refund",
                table: "Tips",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                table: "Tips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Success",
                table: "Tips",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
