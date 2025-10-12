# 🚀 CryptoAlarm Database Setup Guide

This guide will help you set up Supabase database for your CryptoAlarm application with full CRUD functionality.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Ensure you have Node.js installed
3. **Git**: For version control

## 🎯 Step 1: Create Supabase Project

1. **Create New Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New project"
   - Choose your organization
   - Enter project name: `cryptoalarm`
   - Set a strong database password
   - Choose your region (closest to your users)
   - Click "Create new project"

2. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll see a dashboard once ready

## 🔧 Step 2: Configure Environment Variables

1. **Get Project Credentials**
   - Go to `Settings` → `API` in your Supabase dashboard
   - Copy your `Project URL`
   - Copy your `anon` `public` key

2. **Update Environment File**
   ```bash
   # Open your .env.local file
   cd frontend
   ```

3. **Add Credentials**
   ```env
   # Replace with your actual values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 🗄️ Step 3: Set Up Database Schema

1. **Open SQL Editor**
   - Go to `SQL Editor` in your Supabase dashboard
   - Click `New query`

2. **Run Database Schema**
   - Copy the entire contents from `docs/database-schema.sql`
   - Paste into the SQL editor
   - Click `Run` to execute

3. **Verify Tables Created**
   - Go to `Table Editor`
   - You should see these tables:
     - `profiles`
     - `alerts`
     - `alert_conditions`
     - `alert_notifications`
     - `alert_logs`
     - `price_history`

## 📦 Step 4: Install Dependencies

```bash
cd frontend
npm install @supabase/supabase-js @radix-ui/react-tabs
```

## 🔐 Step 5: Configure Authentication

1. **Enable Email Authentication**
   - Go to `Authentication` → `Settings`
   - Ensure `Enable email confirmations` is checked
   - Set `Site URL` to your domain (e.g., `http://localhost:3000` for development)

2. **Configure Email Templates (Optional)**
   - Customize confirmation and password reset emails
   - Go to `Authentication` → `Email Templates`

## 🏃‍♂️ Step 6: Test the Setup

1. **Start Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Authentication**
   - Go to `http://localhost:3000`
   - Try signing up with a test email
   - Check your email for confirmation
   - Sign in after confirming

3. **Test Alert Creation**
   - Create a new alert
   - Verify it appears in the Supabase dashboard
   - Test editing and deleting alerts

## 🔒 Step 7: Security Configuration

### Row Level Security (RLS)

The schema automatically enables RLS on all tables. Here's what it does:

- **Profiles**: Users can only see/edit their own profile
- **Alerts**: Users can only manage their own alerts
- **Alert Conditions**: Linked to user's alerts only
- **Alert Logs**: Users see only their alert history

### API Security

- **Public Key**: Safe for frontend use
- **Service Role Key**: Keep secret, use for server-side operations only

## 🌐 Step 8: Production Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### Domain Configuration

1. **Update Site URL**
   - Go to `Authentication` → `Settings`
   - Update `Site URL` to your production domain
   - Add redirect URLs if needed

2. **SSL Configuration**
   - Ensure your domain uses HTTPS
   - Supabase requires secure connections in production

## 🔧 Advanced Configuration

### Real-time Subscriptions

The app uses Supabase real-time features for live updates:

```javascript
// Already configured in AlertService
const subscription = AlertService.subscribeToAlerts((payload) => {
  // Handle real-time updates
})
```

### Database Triggers

The schema includes automatic triggers for:

- **Updated timestamps**: Automatically updates `updated_at` fields
- **Profile creation**: Creates profile when user signs up
- **Alert logging**: Tracks alert triggers and performance

### Performance Optimization

1. **Indexes**: Pre-configured for common queries
2. **Connection Pooling**: Handled by Supabase
3. **Caching**: Consider implementing Redis for high-traffic scenarios

## 🎛️ Monitoring and Analytics

### Supabase Dashboard

Monitor your app through:

- **Database**: View tables, run queries
- **Authentication**: Track user signups/logins
- **API**: Monitor API usage and performance
- **Logs**: Debug issues with real-time logs

### Custom Metrics

Track important metrics:

```sql
-- Active alerts by user
SELECT 
  u.email,
  COUNT(*) as active_alerts
FROM alerts a
JOIN profiles u ON a.user_id = u.id
WHERE a.is_active = true
GROUP BY u.email;

-- Alert trigger frequency
SELECT 
  symbol,
  COUNT(*) as total_triggers,
  AVG(trigger_count) as avg_triggers_per_alert
FROM alerts
GROUP BY symbol
ORDER BY total_triggers DESC;
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Errors**
   ```
   Error: Missing Supabase environment variables
   ```
   **Solution**: Check your `.env.local` file has correct values

2. **Authentication Issues**
   ```
   Error: Invalid API key
   ```
   **Solution**: Verify you're using the `anon` key, not `service_role`

3. **RLS Policy Errors**
   ```
   Error: Row Level Security policy violation
   ```
   **Solution**: Ensure user is properly authenticated

4. **Real-time Not Working**
   ```
   Subscription not receiving updates
   ```
   **Solution**: Check browser developer tools for WebSocket errors

### Debug Tools

1. **Supabase Logs**
   - Go to `Logs` in dashboard
   - Filter by function, database, or real-time

2. **Browser Developer Tools**
   - Check Network tab for API calls
   - Look for WebSocket connections
   - Monitor Console for JavaScript errors

3. **Database Queries**
   ```sql
   -- Check if RLS is working
   SELECT * FROM alerts; -- Should only show user's alerts
   
   -- Verify user profile
   SELECT * FROM profiles WHERE id = auth.uid();
   ```

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Domain SSL certificate active
- [ ] Site URL updated in Supabase
- [ ] Email templates customized
- [ ] Database backups enabled
- [ ] Monitoring alerts configured
- [ ] Performance metrics tracking
- [ ] Error logging implemented

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🆘 Support

If you encounter issues:

1. Check the [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
2. Visit [Supabase Community Discord](https://discord.supabase.com)
3. Review the [troubleshooting docs](https://supabase.com/docs/guides/platform/troubleshooting)

---

**Next Steps**: Once your database is set up, you can start creating alerts and monitoring cryptocurrency prices with full CRUD functionality! 🎉