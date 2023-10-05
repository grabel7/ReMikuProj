using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using mikuProj.API.Models;

namespace mikuProj.API.Data
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Music> Musics { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        
        public IEnumerable<Music> Search(string query)
        {
            query = query.ToLower();
            var results = Musics.Where(e => e.VideoName.ToLower().Contains(query) || 
                                            e.VideoId.ToLower().Contains(query) || 
                                            e.Channel.ToLower().Contains(query) ).ToList();
            return results;
        }

        public IEnumerable<Music> PlaylistFavorites()
        {
            var results = Musics.Where(f => f.Favorite.Equals(true));

            return results;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Music>()
            .HasKey(m => m.SongId); // Primary Key

        modelBuilder.Entity<Playlist>()
            .HasKey(pm => pm.PlaylistId);

        modelBuilder.Entity<Music>()
            .HasMany(m => m.Playlists)
            .WithMany(p => p.Musics)
            .UsingEntity(j => j.ToTable("PlaylistMusic")); // Nome da tabela intermediária
    }
    }
}