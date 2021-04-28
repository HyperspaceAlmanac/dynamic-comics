using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class useAccountId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comics_AspNetUsers_ArtistId",
                table: "Comics");

            migrationBuilder.AlterColumn<int>(
                name: "ArtistId",
                table: "Comics",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comics_Accounts_ArtistId",
                table: "Comics",
                column: "ArtistId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comics_Accounts_ArtistId",
                table: "Comics");

            migrationBuilder.AlterColumn<string>(
                name: "ArtistId",
                table: "Comics",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Comics_AspNetUsers_ArtistId",
                table: "Comics",
                column: "ArtistId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
