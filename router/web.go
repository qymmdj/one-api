package router

import (
	"embed"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/songquanpeng/one-api/common/config"
	"github.com/songquanpeng/one-api/common/logger"
	"github.com/songquanpeng/one-api/controller"
	"github.com/songquanpeng/one-api/middleware"
)

func SetWebRouter(router *gin.Engine, buildFS embed.FS) {
	indexPageData, _ := buildFS.ReadFile(fmt.Sprintf("web/build/%s/index.html", config.Theme))
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())

	logger.SysLog(fmt.Sprintf("sitech theme index.html size: %d bytes", len(indexPageData)))

	router.GET("/assets/*filepath", func(c *gin.Context) {
		filepath := c.Param("filepath")
		logger.SysLog(fmt.Sprintf("Asset request: %s", filepath))
		if strings.HasPrefix(filepath, "/") {
			filepath = filepath[1:]
		}
		fullPath := fmt.Sprintf("web/build/%s/assets/%s", config.Theme, filepath)
		logger.SysLog(fmt.Sprintf("Reading from embed.FS: %s", fullPath))
		data, err := buildFS.ReadFile(fullPath)
		if err != nil {
			logger.SysLog(fmt.Sprintf("Failed to read asset %s: %v", fullPath, err))
			c.Status(http.StatusNotFound)
			return
		}
		logger.SysLog(fmt.Sprintf("Successfully read asset %s, size: %d", fullPath, len(data)))
		if strings.HasSuffix(filepath, ".js") {
			c.Header("Content-Type", "application/javascript; charset=utf-8")
		} else if strings.HasSuffix(filepath, ".css") {
			c.Header("Content-Type", "text/css; charset=utf-8")
		} else if strings.HasSuffix(filepath, ".svg") {
			c.Header("Content-Type", "image/svg+xml")
		} else if strings.HasSuffix(filepath, ".ico") {
			c.Header("Content-Type", "image/x-icon")
		} else if strings.HasSuffix(filepath, ".png") {
			c.Header("Content-Type", "image/png")
		} else if strings.HasSuffix(filepath, ".jpg") || strings.HasSuffix(filepath, ".jpeg") {
			c.Header("Content-Type", "image/jpeg")
		}
		c.Data(http.StatusOK, c.GetHeader("Content-Type"), data)
	})

	router.GET("/favicon.ico", func(c *gin.Context) {
		fullPath := fmt.Sprintf("web/build/%s/favicon.ico", config.Theme)
		data, err := buildFS.ReadFile(fullPath)
		if err != nil {
			c.Status(http.StatusNotFound)
			return
		}
		c.Header("Content-Type", "image/x-icon")
		c.Data(http.StatusOK, "image/x-icon", data)
	})

	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") {
			controller.RelayNotFound(c)
			return
		}
		if strings.HasPrefix(c.Request.RequestURI, "/assets/") {
			logger.SysLog(fmt.Sprintf("NoRoute for asset: %s", c.Request.RequestURI))
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPageData)
	})
}
