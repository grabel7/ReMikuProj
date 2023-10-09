using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mikuProj.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class changingnew2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlaylistImg",
                table: "Playlists",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlaylistImg",
                table: "Playlists");
        }
    }
}
