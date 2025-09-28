# 字体文件夹使用说明

## 文件夹结构
```
public/fonts/
├── README.md          # 本说明文件
├── YourFont.woff2     # 字体文件（推荐格式）
├── YourFont.woff      # 字体文件（兼容格式）
├── YourFont.ttf       # 字体文件（备用格式）
└── YourFont.otf       # 字体文件（备用格式）
```

## 使用方法

### 1. 配置字体
在 `src/config.ts` 中设置字体名称：
```typescript
export const SITE_CONFIG = {
  // ... 其他配置
  GLOBAL_FONT: 'YourFont'  // 填写您的字体名称
} as const;
```

### 2. 添加字体文件
将字体文件放入 `app/public/fonts/` 目录，文件名格式：
- `YourFont.woff2` （推荐，文件最小）
- `YourFont.woff` （兼容性更好）
- `YourFont.ttf` （通用格式）
- `YourFont.otf` （备用格式）

### 3. 字体加载优先级
系统会按以下顺序尝试加载字体：
1. woff2（现代浏览器，文件最小）
2. woff（广泛支持）
3. ttf（通用格式）
4. otf（备用格式）

### 4. 回退机制
如果自定义字体加载失败，系统会自动使用默认字体栈：
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
```

## 注意事项

1. **字体格式**：推荐使用 woff2 格式，文件最小且支持最好
2. **字体名称**：确保字体文件名称与配置中的 `GLOBAL_FONT` 完全一致
3. **文件大小**：建议字体文件总大小不超过 2MB，以保证加载速度
4. **版权问题**：确保您有使用该字体的合法授权
5. **测试**：在多个浏览器中测试字体显示效果

## 示例

假设您有一个名为 "CustomFont" 的字体：

1. 将字体文件放入 `fonts/` 目录：
   - `CustomFont.woff2`
   - `CustomFont.woff`

2. 在 `config.ts` 中设置：
   ```typescript
   GLOBAL_FONT: 'CustomFont'
   ```

3. 重启开发服务器，字体将自动加载并应用到整个网站

## 故障排除

- **字体不显示**：检查文件名是否与配置一致
- **加载缓慢**：考虑使用 woff2 格式或压缩字体文件
- **样式异常**：检查字体是否包含所需的字符集
