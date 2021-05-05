using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace capstone.Migrations
{
    public partial class CommentTimeAndPosition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PanelNumber",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "Comments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PanelNumber",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Comments");
        }
    }
}
