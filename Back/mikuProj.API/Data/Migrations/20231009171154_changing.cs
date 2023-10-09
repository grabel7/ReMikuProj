using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mikuProj.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class changing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbImgUrl",
                table: "Musics",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbImgUrl",
                table: "Musics");
        }
    }
}
