import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Stack,
} from '@mui/material';

export default function CategoryLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button Skeleton */}
      <Box mb={3}>
        <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 2 }} />
      </Box>

      {/* Category Header Skeleton */}
      <Box mb={6}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box>
            <Skeleton variant="text" width={300} height={60} />
            <Skeleton variant="text" width={400} height={32} />
          </Box>
        </Stack>

        {/* Category Stats Skeleton */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width={120} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </Stack>
          <Skeleton variant="text" width={250} height={24} />
        </Stack>
      </Box>

      {/* Divider */}
      <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 4 }} />

      {/* Popular Tools Section Skeleton */}
      <Box mb={6}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="circular" width={20} height={20} />
                  </Box>

                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* All Tools Section Skeleton */}
      <Box>
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="circular" width={20} height={20} />
                  </Box>

                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Related Categories Skeleton */}
      <Box mt={8}>
        <Skeleton variant="text" width={220} height={36} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="rounded" width={60} height={20} sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}